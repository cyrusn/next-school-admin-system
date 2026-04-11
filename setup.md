# System Setup Guide

This guide will walk you through setting up the Next.js School Admin System, configuring the necessary environment variables, connecting the Google Service Account, structuring the required Google Sheets, and deploying the system.

## Table of Contents

1. [Setting Up Environment Variables (`.env`)](#1-setting-up-environment-variables-env)
2. [Setting up Google Service Account (`.env.key.json`)](#2-setting-up-google-service-account-envkeyjson)
3. [Google Spreadsheet Details](#3-google-spreadsheet-details)
    - [Students Spreadsheet](#students-spreadsheet)
    - [Teachers Spreadsheet](#teachers-spreadsheet)
    - [Announcements Spreadsheet](#announcements-spreadsheet)
    - [iPad Management Spreadsheet](#ipad-management-spreadsheet)
    - [Club Registration Spreadsheet](#club-registration-spreadsheet)
    - [ECA Evaluation Spreadsheet](#eca-evaluation-spreadsheet)
    - [OLE (Other Learning Experiences) Spreadsheet](#ole-other-learning-experiences-spreadsheet)
    - [Student Profile Spreadsheet](#student-profile-spreadsheet)
    - [Timetable Spreadsheet](#timetable-spreadsheet)
    - [Flipped Classroom Spreadsheet](#flipped-classroom-spreadsheet)
    - [Attendance Reasons Spreadsheet](#attendance-reasons-spreadsheet)
4. [Starting the Application (Local Development)](#4-starting-the-application-local-development)
5. [Deployment & Server Execution](#5-deployment--server-execution)

---

## 1. Setting Up Environment Variables (`.env`)

The system relies on a `.env.development` (for local development) or `.env.production` file. You need to create this file in the root directory.

### How to get a Google Sheet ID:
Open your Google Spreadsheet in the browser. The URL will look like this:
`https://docs.google.com/spreadsheets/d/<SHEET_ID>/edit`

Copy the `<SHEET_ID>` and paste it into the respective variable in your `.env` file.

**Example `.env` configuration:**
```env
# Google Service Account Key
GOOGLE_API_KEY_FILENAME=".env.key.json"

# NextAuth configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_secret_here"

# Google Sheet IDs
STUDENT_GOOGLE_SHEET_ID="your_sheet_id_here"
TEACHER_GOOGLE_SHEET_ID="your_sheet_id_here"
OLE_GOOGLE_SHEET_ID="your_sheet_id_here"
ANNOUNCEMENT_GOOGLE_SHEET_ID="your_sheet_id_here"
CLUB_REGISTRATION_SSID="your_sheet_id_here"
ECA_EVALUATION_SSID="your_sheet_id_here"
TIMETABLE_SSID="your_sheet_id_here"
STUDENT_PROFILE_SSID="your_sheet_id_here"
IPAD_SSID="your_sheet_id_here"
FLIPPED_CLASSROOM_SSID="your_sheet_id_here"
```

---

## 2. Setting up Google Service Account (`.env.key.json`)

To allow the system to read and write data to the Google Sheets without human intervention, you need to provide a Google Cloud Service Account credential file.

1. Go to the [Google Cloud Console](https://console.cloud.google.com/) and create a new project (or use an existing one).
2. Go to **APIs & Services > Library** and enable the following APIs:
   - **Google Sheets API**
   - **Google Drive API**
   - **Google Calendar API** (if needed)
3. Go to **IAM & Admin > Service Accounts** and click **Create Service Account**.
4. Once created, click on the Service Account, go to the **Keys** tab, and click **Add Key > Create new key > JSON**.
5. A JSON file will download to your computer. Rename this file to exactly `.env.key.json`.
6. Place `.env.key.json` in the root directory of this project.
7. **Crucial Step:** Open `.env.key.json` and find the `client_email` address. **You must share every Google Sheet and Drive Folder listed in your `.env` file with this exact email address and grant it "Editor" permissions.**

---

## 3. Google Spreadsheet Details

The system reads the **first row (Row 1)** of each Google Sheet as property names. You **MUST** ensure the tab names and Row 1 column titles match the following exactly.

### Students Spreadsheet
- **Environment Variable**: `STUDENT_GOOGLE_SHEET_ID`
- **Sheets**:

#### Sheet: `students`
Contains basic student information.
- **Headers**: `regno`, `classcode`, `classno`, `ename`, `cname`, `sex`, `house`, `dob`, `schoolYear`, `x1`, `x2`, `x3`, `isSen`, `isNcs`, `isNewlyArrived`, `regDate`, `isHidden`, `isSkip`, `isAllowAccessories`, `remark`, `isImport`
- **Example**:
| regno | classcode | classno | ename | cname | sex | house | dob | schoolYear | ... | isSkip |
|-------|-----------|---------|-------|-------|-----|-------|-----|------------|-----|--------|
| 202401| 1A        | 1       | CHAN TAI MAN | 陳大文 | M | RED | 2010-01-01 | 2023-2024 | ... | FALSE |

#### Sheet: `groups`
Maps students to various groups/houses.
- **Headers**: `regno`, `groupName`
- **Example**:
| regno | groupName |
|-------|-----------|
| 202401| Red House |

---

### Teachers Spreadsheet
- **Environment Variable**: `TEACHER_GOOGLE_SHEET_ID`
- **Sheet**: `staff`
- **Headers**: `email`, `initial`, `name`, `cname`, `role`, `classMaster`, `readingTeacher`, `title`, `type`, `department`, `isActive`
- **Note**: This spreadsheet is used for authentication and permission management.
- **Example**:
| email | initial | name | cname | role | classMaster | readingTeacher | title | type | department | isActive |
|-------|---------|------|-------|------|-------------|----------------|-------|------|------------|----------|
| teacher@school.edu.hk | TCH | CHING SIU YUEN | 程少遠 | 1 | 1A | TRUE | Teacher | Full-Time | Science | TRUE |

---

### Announcements Spreadsheet
- **Environment Variable**: `ANNOUNCEMENT_GOOGLE_SHEET_ID`
- **Sheet**: First sheet (default)
- **Headers**: `timestamp`, `date`, `pic`, `from`, `targetType`, `target`, `announcedBy`, `content`, `skip`
- **Example**:
| timestamp | date | pic | from | targetType | target | announcedBy | content | skip |
|-----------|------|-----|------|------------|--------|-------------|---------|------|
| 2026-04-11T10:00:00 | 2026-04-12 | TCH | Science Dept | 0 | all | 1 | No Science Club meeting tomorrow | |

---

### iPad Management Spreadsheet
- **Environment Variable**: `IPAD_SSID`
- **Sheet**: `record`
- **Headers**: `timestamp`, `regno`, `studentName`, `classcode`, `classno`, `status`, `freq`, `initial`, `teacher_1`, `issueDate_1`, `teacher_2`, `issueDate_2`, `teacher_3`, `issueDate_3`
- **Example**:
| timestamp | regno | studentName | classcode | classno | status | freq | initial | teacher_1 | issueDate_1 | teacher_2 | issueDate_2 | teacher_3 | issueDate_3 |
|-----------|-------|-------------|-----------|---------|--------|------|---------|-----------|-------------|-----------|-------------|-----------|-------------|
| 2026-04-11T11:00:00 | 202401 | 陳大文 | 1A | 1 | PENDING | 1 | TCH | | | | | | |

---

### Club Registration Spreadsheet
- **Environment Variable**: `CLUB_REGISTRATION_SSID`
- **Sheets**:

#### Sheet: `club`
List of available clubs and their supervisors.
- **Headers**: `id`, `name`, `cname`, `ename`, `category`, `description`, `pic`, `associates`, `admininstrators`
- **Example**:
| id | name | cname | ename | category | description | pic | associates | admininstrators |
|----|------|-------|-------|----------|-------------|-----|------------|-----------------|
| 1 | Coding Club | 編程學會 | Coding Club | Academic | Learn to code | TCH | AS1, AS2 | ADM |

#### Sheet: `information` (or `record`)
Details of club registration/session plans.
- **Headers**: `timestamp`, `uid`, `clubId`, `id`, `category`, `information`, `regno`, `classcodeAndNo`, `studentName`, `activityType`, `activityTypeValue`, `modeType`, `modeValue`, `resources`, `requireRegularAnnoucement`, `sessionPlan1`, `sessionPlan2`, `sessionPlan3`, `sessionPlan4`, `sessionPlan5`, `noOfActivity`, `fee`, `isConfirmed`

---

### ECA Evaluation Spreadsheet
- **Environment Variable**: `ECA_EVALUATION_SSID`
- **Sheet**: `record` (or `information`)
- **Headers**: `timestamp`, `uid`, `id`, `clubId`, `category`, `information`, `regno`, `classcodeAndNo`, `studentName`, `grade`, `role`, `isNominated`, `pic`, `associates`, `admininstrators`

---

### OLE (Other Learning Experiences) Spreadsheet
- **Environment Variable**: `OLE_GOOGLE_SHEET_ID`
- **Sheets**:

#### Sheet: `events`
- **Headers**: `eventId`, `title`, `description`, `objective`, `efficacy`, `pics`, `category`, `organization`, `components`, `committeeAndKla`, `imageFolderUrl`, `isOrganizedBySchool`, `isLocked`, `timestamp`, `markedTimestamp`, `isUpdated`

#### Sheet: `participants`
- **Headers**: `uid`, `participantId`, `eventId`, `regno`, `classcode`, `classno`, `studentName`, `role`, `startDate`, `endDate`, `term`, `hours`, `achievement`, `isHighlight`, `awardName`, `awardType`, `awardStatus`, `isAward`, `timestamp`, `markedTimestamp`, `isUpdated`, `generatedReport`

---

### Student Profile Spreadsheet
- **Environment Variable**: `STUDENT_PROFILE_SSID`
- **Sheets**:

#### Sheet: `comment`
Teacher comments on students.
- **Headers**: `id`, `commentId`, `regno`, `type`, `category`, `content`, `comment`, `createdBy`, `schoolYear`, `timestamp`
- **Example**:
| commentId | regno | type | content | createdBy | schoolYear | timestamp |
|-----------|-------|------|---------|-----------|------------|-----------|
| 1 | 202401 | LEARNING_TRAIT | Good performance in class | TCH | 2025 | 2026-04-11T12:00:00 |

#### Sheet: `privileges`
Access rights for student profiles.
- **Headers**: `regno`, `initial`, `privileges`, `classcodes`, `privilege`, `value`

#### Sheet: `sen`
Special Educational Needs student list.
- **Headers**: `regno`

---

### Timetable Spreadsheet
- **Environment Variable**: `TIMETABLE_SSID`
- **Sheets**:
    - `1st_teacher`
    - `1st_class`
    - `1st_location`
    - `2nd_teacher`
    - `2nd_class`
    - `2nd_location`
- **Note**: These sheets contain complex data usually generated by timetable software. Headers should follow the output format of the respective software (they map periods and days of the week).

---

### Flipped Classroom Spreadsheet
- **Environment Variable**: `FLIPPED_CLASSROOM_SSID`
- **Sheets**:

#### Sheet: First sheet (default)
- **Headers**: `timestamp`, `subjectOrDepartment`, `topic`, `url`, `remarks`, ... (up to 10 columns)

#### Sheet: `SubjectOrDepartments`
- **Headers**: `SubjectOrDepartment`, `name`

---

### Attendance Reasons Spreadsheet
- **Environment Variable**: `REASON_OF_LEAVE_SSID`
- **Sheet**: First sheet (default)
- **Headers**: `timestamp`, `id`, `eventDate`, `regno`, `classcode`, `classno`, `ename`, `cname`, `type`, `initial`, `filename`, `webViewLink`

---

## 4. Starting the Application (Local Development)

Once your `.env.development` / `.env.production` files are populated and `.env.key.json` is correctly placed:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

Your system should now be securely connected to Google Sheets and fully operational on `http://localhost:3000`.

---

## 5. Deployment & Server Execution

The project includes shell scripts to simplify building the Docker image, syncing it to your server, and running it.

### 1. Build the Docker Image (Local)
Run the `build.sh` script to build the multi-platform Docker image (`linux/amd64`) and save it locally as an `app.tar` archive:

```bash
./build.sh
```

### 2. Sync to Server (Local)
Run the `sync.sh` script to transfer the `app.tar` archive and necessary execution scripts (`load.sh`, `restart.sh`, `start.sh`) to your remote server using `rsync`:

```bash
./sync.sh
```

*(Note: You may need to edit `sync.sh` to configure the `LOCATION` and `DEST` variables according to your server credentials).*

### 3. Run the Docker Image (Server)
SSH into your server, navigate to the project directory, and use one of the following scripts to run the application:

- **To start the application for the first time:**

```bash
./start.sh
```

  *(This script creates and starts a new container named `next` on port 3000).*

- **To update and restart an existing deployment:**

```bash
./restart.sh
```

  *(This script will load the newly synced `app.tar`, stop and remove the existing `next` container, and start the updated container on port 3000).*
