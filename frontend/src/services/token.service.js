class TokenService {
    getLocalAccessToken() {
        const jwt = JSON.parse(localStorage.getItem("jwt"));
        return jwt ? jwt : null;
    }

    updateLocalAccessToken(token) {
        window.localStorage.setItem("jwt", JSON.stringify(token));
    }

    getUser() {
        return JSON.parse(localStorage.getItem("user"));
    }

    setUser(user) {
        window.localStorage.setItem("user", JSON.stringify(user));
    }

    removeUser() {
        window.localStorage.removeItem("user");
        window.localStorage.removeItem("jwt");
    }

}
const tokenService = new TokenService();

export default tokenService;