export interface ISuperAdminPayload {
    superAdmin: {
        name: string;
        email: string;
        profilePhoto: string;
        contactNumber: string;
    };
} 
export interface IUpdateSuperAdminPayload {
    superAdmin: {
        name: string;
        email: string;
        profilePhoto: string;
        contactNumber: string;
    };
} 