# REST API for the UMLS DB

Endpoints to retrieve content from the UMLS database

| HTTP REQUEST TYPE | PATH | DESCRIPTION |
| --- | --- | --- |
| GET | /concept_information/CUI/{CUI} | Retrieves all the concept information found in the MRCONSO Table |
| GET | /definition/CUI/{CUI} | Retrieves a list of all the defintions and terms asscoiated with a specified CUI |
