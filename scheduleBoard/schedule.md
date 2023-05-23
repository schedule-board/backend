# User requirements
## Basic terminology
in this document, it's important to identify the meanings of these two terms:

 - subject: means a data unit that has a name, a description and a teacher as an owner
 - schedule: means a data unit that has a starting time, end time, day of week, and associated subject. A subject will possibly have multiple schedules in one week.
 - announcement: is a data unit that has a message in it. it is associated with a particular subject. the message is supposed to be delivered to all students who follow the subject.

## what teachers can do (in the whole app)
 - CRUD operation on subjects and schedules
 - CRUD operations on announcements (depend on schedules)

 - sign-up
 - sign-in
 - profile edit (including pictures)
 - deleting account
 - changing themes of the app

 


## What students can do (in the whole app)
 - search and discover subjects
 - follow and unfollow subjects
 - see realtime changes on schedules (when the teacher changes it)

 - get notifications when schedules change and announcements are published.
 - sign in
 - sign up
 - profile editing (including images)
 - deleting an account
 - change the theme of the app.
 



# screens (and what users can do on each screen)

## sign in
here users can:

 - enter email and password to sign in
 - go to the sign up page

## sign up
here users can:

 - enter new email, password and password verification to create an account
 - go to the sign in page

## landing page
here users can:

 - watch their schedule table.
 - for teachers: click the + FAB and go to the "create subject" screen
 - for teachers: make announcements to a specific subject.
 - access announcements

## schedule popup
this is not really a page but it's a small popup window that appears when a schedule is clicked. it serves navigation purposes to different screens of the app.

### content of the schedule popup:
 - for the teachers (owners), quick edit options for basic editing needs on the clicked schedule; such as disabling a schedule for this week.
 - for the teachers (owners) an option to create announcement specific to the clicked subject
 - an option to display the subject in the subject detail page
 - an option to see the list of announcements specific to the clicked schedule.

## profile page
here users can:

 - can see their profile details
 - can edit their profile
 - log out
 - can delete their accounts

## stats page (has content only if the user has created subjects)
here users can:

 - see the stats of their subjects (like how many people are following it)

## subject creation page
here users can:

 - create a new subject and fill all the details

## subject detail page
here users can:

 - can see details about the subject (such as the teacher name, schedules, the description)
 - for the teachers (owners), an option to edit the details of the subject

## announcement page
here users can:

 - can see all relevant announcements
 - filter announcements with subjects, date, ...
 - for the teachers (owners of the associated subject), an option to edit or delete the announcement. 