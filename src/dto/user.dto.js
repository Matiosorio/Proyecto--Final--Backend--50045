class UserDTO {
    constructor(firstName, lastName, role, email) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.email = email;
        this.fullname = `${firstName} ${lastName}` 
    }
}

module.exports = UserDTO;