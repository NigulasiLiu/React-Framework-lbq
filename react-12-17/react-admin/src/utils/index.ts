import queryString from 'query-string';
import jwtDecode from 'jwt-decode';

/**
 * 验证JWT的有效性，包括检查是否过期
 * @param token JWT字符串
 * @returns {boolean} 如果JWT有效且未过期返回true，否则返回false
 */
export const verifyJWT = (token: string): boolean => {
    try {
        const decoded: any = jwtDecode(token);
        const current_time = Date.now() / 1000;  // 获取当前时间的Unix时间戳，单位为秒
        if (decoded.exp < current_time) {
            // exp是JWT的过期时间戳，也是以秒为单位
            return false; // 令牌过期
        }
        return true; // 令牌有效
    } catch (error) {
        return false; // 解码失败或其他错误
    }
};
/**
 * 获取URL参数
 */
export function parseQuery() {
    return queryString.parseUrl(window.location.href).query;
}

/**
 * 校验是否登录
 * @param permits
 */
export const checkLogin = (): boolean => {
    if (process.env.NODE_ENV === 'development') {
        return true;
    }

    const token = localStorage.getItem('jwt_token');
    // 假设你有一个函数来验证JWT的有效性
    return !!token && verifyJWT(token);
    // return !!token;
};

// export const checkLogin = (permits: any): boolean =>
//     (process.env.NODE_ENV === 'production' && !!permits) || process.env.NODE_ENV === 'development';
