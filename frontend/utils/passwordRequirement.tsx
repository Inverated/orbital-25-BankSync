export function checkPasswordRequirement(password: string) {
    if (password.length < 6) {
        return 'Password length must be at least 6 characters long'
    }
    const lower = 'abcdefghijklmnopqrstuvwxyz'
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const digits = '0123456789'
    const special = '!@#$%^&*()_+-=[]{};\':"|<>?,./`~.'
    let hasLower, hasUpper, hasDigit, hasSpecial = false
    for (let i = 0; i < password.length; i++) {
        if (lower.indexOf(password[i]) != -1) hasLower = true
        if (upper.indexOf(password[i]) != -1) hasUpper = true
        if (digits.indexOf(password[i]) != -1) hasDigit = true
        if (special.indexOf(password[i]) != -1) hasSpecial = true
    }
    if (!hasLower) return 'Password need to have at least 1 lowercase'
    if (!hasUpper) return 'Password need to have at least 1 uppercase'
    if (!hasDigit) return 'Password need to have at least 1 digit'
    if (!hasSpecial) return 'Password need to have at least 1 special character'
    return null
}