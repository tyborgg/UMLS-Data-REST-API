# REST API for the UMLS DB

Endpoints to retrieve content from the UMLS database

| HTTP REQUEST TYPE | PATH | DESCRIPTION |
| --- | --- | --- |
| GET | /concept/CUI/{CUI} | Retrieves all the concept information found in the MRCONSO Table |
| GET | /definition/CUI/{CUI} | Retrieves a list of all the defintions and terms asscoiated with a specified CUI |
| GET | /definition/term/{input} | Retrieves a list of all the defintions and terms asscoiated with a specified term (string value) |
| GET | /relation/CUI/{CUI} | Retrieves a list of all the relationships (related CUIs and respective terms) asscoiated with a specified CUI |
| GET | /relation/term/{input} | Retrieves a list of all the relationships (related CUIs and respective terms) asscoiated with a specified term (string value) |
| GET | /may_treat/CUI/{CUI} | Retrieves a list of all may_treat relationships asscoiated with a specified CUI |
