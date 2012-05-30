/* Mysql user running this script must be given the global 'FILE' grant. */
/* 
  == Note: okfn_org_bp_xprofile_data.field id mapping is as follows:
  {
      "1": "Name"
      "5": "Description/ About me"
      "6": "Location"
      "31": "Website"
      "30": "Identica"
      "29": "Twitter"
  }
*/
SELECT 
  okfn_org_users.user_login, 
  okfn_org_users.display_name, 
  twitters.value AS twitter,
  websites.value AS website,
  locations.value AS location
FROM 
  okfn_org_users
LEFT JOIN  /* Append buddypress.twitter */
  okfn_org_bp_xprofile_data AS twitters
  ON okfn_org_users.ID=twitters.user_id AND twitters.field_id=29
LEFT JOIN  /* Append buddypress.website */
  okfn_org_bp_xprofile_data AS websites
  ON okfn_org_users.ID=websites.user_id AND websites.field_id=31
LEFT JOIN  /* Append buddypress.location */
  okfn_org_bp_xprofile_data AS locations
  ON okfn_org_users.ID=locations.user_id AND locations.field_id=6
;
