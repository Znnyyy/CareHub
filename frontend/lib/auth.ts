export const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
export const getRefreshToken = () => typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
export const getUser = () => {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};
export const isAuthenticated = () => !!getToken();
export const logout = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    }
};