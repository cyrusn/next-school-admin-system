# System Setup Guide

This guide will walk you through setting up the Next.js School Admin System, specifically configuring the necessary environment variables, connecting the Google Service Account, and structuring the required Google Sheets.

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

## 3. Google Spreadsheet Formatting Requirements

The system reads the **first row (Row 1)** of each Google Sheet as property names. You **MUST** ensure the tab names and Row 1 column titles match the following exactly.

### `STUDENT_GOOGLE_SHEET_ID`
*   **Tab: `students`**
    `regno`, `classcode`, `classno`, `ename`, `cname`, `sex`, `house`, `dob`, `schoolYear`, `x1`, `x2`, `x3`, `isSen`, `isNcs`, `isNewlyArrived`, `regDate`, `isHidden`, `isSkip`, `isAllowAccessories`, `remark`, `isImport`
*   **Tab: `groups`**
    `regno`, `groupName`

### `TEACHER_GOOGLE_SHEET_ID`
*   **Tab: `staff`**
    `email`, `initial`, `name`, `cname`, `role`, `classMaster`, `readingTeacher`, `title`, `type`

### `TIMETABLE_SSID`
*   **Tabs:** `1st_teacher`, `1st_class`, `1st_location`, `2nd_teacher`, `2nd_class`, `2nd_location`
    *Note: Column headers in these sheets are used to map periods and days of the week.*

### `CLUB_REGISTRATION_SSID` & `ECA_EVALUATION_SSID`
*   **Tab: `club`**
    `id`, `cname`, `ename`, `description`
*   **Tabs: `information` or `record`**
    `timestamp`, `uid`, `id`, `category`, `information`, `regno`, `classcodeAndNo`, `studentName`, `pic`, `associates`, `admininstrators`

### `OLE_GOOGLE_SHEET_ID`
*   **Tab: `events`**
    `eventId`, `title`, `description`, `objective`, `efficacy`, `pics`, `category`, `organization`, `components`, `committeeAndKla`, `imageFolderUrl`, `isOrganizedBySchool`, `timestamp`
*   **Tab: `participants`**
    `uid`, `eventId`, `regno`, `classcode`, `classno`, `studentName`, `role`, `startDate`, `endDate`, `term`, `hours`, `achievement`, `isHighlight`, `awardName`, `awardType`, `awardStatus`, `isAward`

### `STUDENT_PROFILE_SSID`
*   **Tab: `comment`**
    `id`, `regno`, `comment`, `category`, `timestamp`
*   **Tab: `sen`**
    `regno`
*   **Tab: `privileges`**
    `regno`, `privilege`, `value`

### `IPAD_SSID`
*   **Tab: `record`**
    `timestamp`, `regno`, `studentName`, `classcode`, `classno`, `status`, `freq`, `initial`, `teacher_1`, `teacher_2`, `teacher_3`

### `FLIPPED_CLASSROOM_SSID`
*   **Tab: `SubjectOrDepartments`**
    `SubjectOrDepartment`

## 4. Starting the Application

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