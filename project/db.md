# Database Structure Mapping

This document outlines the database structure for the Senda Behavioral Health Management System based on the provided CSV data.

## Core Tables and Relationships

### 1. Patients Table
The central entity that stores demographic information for each patient.

```
patients
├── id (UUID, PK)
├── mrn (TEXT, UNIQUE) - Medical Record Number
├── first_name (TEXT)
├── last_name (TEXT)
├── date_of_birth (DATE)
├── gender (TEXT) - Enum: 'male', 'female', 'other', 'prefer_not_to_say'
├── phone (TEXT)
├── email (TEXT)
├── address (JSONB) - Structured address data
├── emergency_contact (JSONB)
├── insurance_info (JSONB)
├── preferred_language (TEXT)
├── is_active (BOOLEAN)
├── risk_level (TEXT) - Enum: 'low', 'medium', 'high', 'critical'
├── assigned_provider_id (UUID, FK -> users.id)
├── created_at (TIMESTAMPTZ)
└── updated_at (TIMESTAMPTZ)
```

### 2. Episodes Table (Interactions)
Represents treatment episodes or interactions with patients.

```
episodes
├── id (UUID, PK)
├── patient_id (UUID, FK -> patients.id)
├── provider_id (UUID, FK -> users.id)
├── episode_type (TEXT) - Enum: 'initial', 'continuing', 'crisis', 'followup'
├── status (TEXT) - Enum: 'active', 'completed', 'discontinued', 'transferred'
├── start_date (DATE)
├── end_date (DATE)
├── diagnosis_codes (TEXT[]) - Array of ICD-10 codes
├── treatment_goals (TEXT[])
├── notes (TEXT)
├── created_at (TIMESTAMPTZ)
└── updated_at (TIMESTAMPTZ)
```

### 3. Assessments Table (Screeners)
Stores assessment data from various screening tools.

```
assessments
├── id (UUID, PK)
├── patient_id (UUID, FK -> patients.id)
├── episode_id (UUID, FK -> episodes.id)
├── provider_id (UUID, FK -> users.id)
├── assessment_type (TEXT) - Enum: 'phq9', 'gad7', 'pcl5', 'edinburgh', 'custom'
├── score (INTEGER)
├── max_score (INTEGER)
├── responses (JSONB) - Individual question responses
├── interpretation (TEXT)
├── administered_date (DATE)
└── created_at (TIMESTAMPTZ)
```

### 4. Notes Table
Clinical documentation linked to episodes.

```
notes
├── id (UUID, PK)
├── patient_id (UUID, FK -> patients.id)
├── episode_id (UUID, FK -> episodes.id)
├── provider_id (UUID, FK -> users.id)
├── note_type (TEXT) - Enum: 'progress', 'assessment', 'treatment_plan', 'crisis', 'discharge'
├── title (TEXT)
├── content (TEXT)
├── is_locked (BOOLEAN)
├── created_at (TIMESTAMPTZ)
└── updated_at (TIMESTAMPTZ)
```

### 5. Diagnoses Table (ICD-10 Codes)
Based on the ICD-10 data provided, this table stores standardized diagnosis codes.

```
diagnoses
├── id (UUID, PK)
├── code (TEXT) - The ICD-10 code (e.g., "F41.9")
├── description (TEXT) - Full description (e.g., "Anxiety disorder, unspecified")
├── category (TEXT) - Broad category (e.g., "Mental Health", "Physical Health")
├── is_active (BOOLEAN)
└── created_at (TIMESTAMPTZ)
```

### 6. Patient_Diagnoses (Junction Table)
Links patients to their diagnoses with timestamps.

```
patient_diagnoses
├── id (UUID, PK)
├── patient_id (UUID, FK -> patients.id)
├── episode_id (UUID, FK -> episodes.id)
├── diagnosis_id (UUID, FK -> diagnoses.id)
├── diagnosed_date (DATE)
├── diagnosed_by_id (UUID, FK -> users.id)
├── status (TEXT) - Enum: 'active', 'resolved', 'in_remission'
├── created_at (TIMESTAMPTZ)
└── updated_at (TIMESTAMPTZ)
```

## Data Relationships

```
                                  ┌─────────────┐
                                  │    Users    │
                                  └─────┬───────┘
                                        │
                                        │ assigned_provider_id
                                        │
                                        ▼
┌─────────────┐                  ┌─────────────┐                  ┌─────────────┐
│  Diagnoses  │◄─────────────────┤   Patients  ├─────────────────►│ Assessments │
└─────┬───────┘  patient_diagnoses└─────┬───────┘                  └─────────────┘
      │                                 │
      │                                 │ patient_id
      │                                 │
      │                                 ▼
      │                          ┌─────────────┐
      └─────────────────────────►│   Episodes  │◄─────────────────┐
                                 └─────┬───────┘                  │
                                       │                          │
                                       │ episode_id               │
                                       │                          │
                                       ▼                          │
                                ┌─────────────┐                   │
                                │    Notes    │───────────────────┘
                                └─────────────┘
```

## ICD-10 Code Analysis

From the provided ICD-10 data, we can see:

1. **Mental Health Diagnoses** are prevalent:
   - F-codes (Mental, Behavioral disorders)
   - Anxiety disorders (F41.x)
   - Depressive disorders (F32.x, F33.x)
   - Adjustment disorders (F43.2x)
   - PTSD (F43.10)

2. **Social Determinants of Health**:
   - Z-codes (Factors influencing health status)
   - Housing/economic issues (Z59.x)
   - Education/literacy issues (Z55.x)
   - Employment issues (Z56.x)

3. **Temporal Tracking**:
   - Diagnoses are tracked with dates
   - Multiple diagnoses per patient over time

## Import Strategy

Based on the ICD-10 data structure, the import process should:

1. **Pre-load standard ICD-10 codes** into the diagnoses table
2. **Import patients** first (demographic data)
3. **Import episodes** (interactions) with dates
4. **Link diagnoses** to patients through episodes
5. **Import notes** linked to episodes
6. **Import assessments** with scores and dates

## Data Validation Rules

1. **ICD-10 Codes**:
   - Must follow standard format (letter followed by numbers, optional decimal, additional numbers)
   - Should exist in standard ICD-10 reference table

2. **Dates**:
   - Must be valid dates
   - Episode dates should be chronological (start_date ≤ end_date)
   - Assessment dates should fall within episode dates

3. **Relationships**:
   - Every episode must have a valid patient_id
   - Every note must have a valid episode_id
   - Every assessment must have a valid patient_id

## Indexes for Performance

```sql
-- Patient lookup by MRN
CREATE INDEX idx_patients_mrn ON patients(mrn);

-- Provider's patient list
CREATE INDEX idx_patients_provider ON patients(assigned_provider_id);

-- Episodes for a patient
CREATE INDEX idx_episodes_patient ON episodes(patient_id);

-- Episodes by provider
CREATE INDEX idx_episodes_provider ON episodes(provider_id);

-- Assessments for a patient
CREATE INDEX idx_assessments_patient ON assessments(patient_id);

-- Diagnoses lookup
CREATE INDEX idx_diagnoses_code ON diagnoses(code);

-- Patient diagnoses
CREATE INDEX idx_patient_diagnoses_patient ON patient_diagnoses(patient_id);
CREATE INDEX idx_patient_diagnoses_diagnosis ON patient_diagnoses(diagnosis_id);
```

## Additional Considerations

1. **Audit Logging**:
   - Track all changes to patient records
   - Essential for HIPAA compliance

2. **Data Migration**:
   - Batch processing for large datasets
   - Validation before insertion
   - Error handling and reporting

3. **Performance**:
   - Denormalize frequently accessed data
   - Consider materialized views for reporting

4. **Security**:
   - Row-level security policies
   - Data encryption for sensitive fields