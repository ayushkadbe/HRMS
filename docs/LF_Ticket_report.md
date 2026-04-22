# LF Ticket Report

This file gives a quick implementation summary for the five assignment tickets.

## LF-101: Wrong date format on payslip

### What was changed

- Updated payslip date rendering from `MM/DD/YYYY` to `DD/MM/YYYY`
- Applied the new format in the payslip print/view flow so the displayed dates match the expected India-friendly format

### Main outcome

- Site managers now see payslip dates in `DD/MM/YYYY`

## LF-102: Salary field accepts negative numbers

### What was changed

- Added frontend validation to block negative values in salary-related amount inputs
- Added backend validation to reject non-positive values even if a request bypasses the frontend
- Applied validation to position salary fields and deduction amount fields

### Main outcome

- Negative or zero salary-related amounts are no longer accepted by the UI or API

## LF-103: Add worker designation field

### What was changed

- Reused the existing `Position Data` source instead of introducing a separate hardcoded designation list
- Updated employee add/edit forms to use a dropdown populated from `data_jabatan`
- Displayed the selected designation/position on the employee list page
- Added a helper SQL seed file for assignment-requested designation values

### Main outcome

- Employee designation is now selected from structured position data and shown consistently in the employee list

### Note

- This was implemented using the existing project data model, so designation is represented by the repo's position/jabatan structure

## LF-104: Export employee list to CSV

### What was changed

- Added a `Download CSV` action on the employee list page
- Export includes employee name, position/designation, and salary data available from the existing system
- CSV generation is done client-side for fast export without adding a new backend endpoint

### Main outcome

- Users can download employee list data directly from the employee page in CSV format

### Note

- The original assignment mentions `department`, but this repo does not have a separate department field, so the export uses the fields already modeled in the system

## LF-105: Fix mobile layout on employee list

### What was changed

- Improved employee list behavior for small screens
- Added mobile-friendly stacked cards
- Preserved an optional horizontal table view for users who still want the table layout on mobile

### Main outcome

- Employee list content is usable on mobile without the original cut-off table issue

## Related Notes

- Each LF ticket was kept in its own commit for easier review
- Overtime planning and overtime implementation details are documented separately
