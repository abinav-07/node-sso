## INTRODUCTION

The application will be using MySQL Relational Database as the company business logics are related to relationships between database entities.

## CONVENTIONS

1. ### Database Names
   - Singular names with first letter capitalized. (Audiobee)
   - Pascal Casing for names with multiple words. (StagingAudiobee)
   - Self Explanatory Names.
2. ### Table Names
   - Singular names to be lowercased. (user)
   - Camel Casing for names with multiple words. (userAddress)
   - Only Alpha English Alphabets.
3. ### Field Names
   - Singular names to be lowercased. (name)
   - Camel Casing for names with multiple words. (firstName)
   - Primary key should be id.(Donot Modify)
   - Only Alpha English Alphabets.
4. ### Normalization
   - Normalize.

## ASR Database

Database Tables:

Future Work:

<!-- - country(id, countryName, countryCode, createdAt, updatedAt); -->

<!-- - language(id, languageName, languageCode, countryId, createdAt, updatedAt); -->

<!-- - user(id, firstName, lastName, userName, email, gender(opt), roleId, dateofBirth(opt), password, phoneNumber(opt), deviceName(opt), countryId(opt), company(opt), nativeLanguageId(opt), createdAt, updatedAt);

- userRecording(id, recordingName, userId, isApproved(opt), languageId(opt), status, isPublished(bool), fileName, fileUrl, audioLength, createdAt, updatedAt); -->

- role(id, role);

- user(id, firstName, lastName, userName, email, password, createdAt, updatedAt);

- userRole(id, userId, roleId);

- userRecording(id, recordingName, userId, status, isPublished(bool/false), transcriptedText, transcriptionType(human/machine), fileName, s3Url, audioLength, createdAt, updatedAt);

- recordingSplit(id, recordingId, splitIndex, s3Url, audioLength, isTranscribed(bool/false), startTime, endTime, createdAt, updatedAt);

- recordingTranscription(id, recordingSplitId, transcriptedText, isCorrect, createdAt, updatedAt);
