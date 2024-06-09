const rolesHierarchy = {
  JE: 1,
  AEE: 2,
  EEE: 3,
  ESE: 4,
  CE: 5,
  StoreInCharge: 6,
};

exports.isRoleAuthorized = (userRole, requiredRole) => {
  return rolesHierarchy[userRole] >= rolesHierarchy[requiredRole];
};
