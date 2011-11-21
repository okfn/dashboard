/* Mysql user running this script must be given the global 'FILE' grant. */

SELECT okfn_org_users.user_login, okfn_org_bp_xprofile_fields.name, okfn_org_bp_xprofile_data.value
INTO OUTFILE '/tmp/okfn_members.csv' 
FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"' LINES TERMINATED BY '\n'
FROM okfn_org_users join okfn_org_bp_xprofile_data on okfn_org_users.id=okfn_org_bp_xprofile_data.user_id join okfn_org_bp_xprofile_fields on field_id=okfn_org_bp_xprofile_fields.id
;

