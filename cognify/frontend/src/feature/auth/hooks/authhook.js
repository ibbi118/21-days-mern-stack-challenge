import { register, login, getMe, resendVerification } from "/src/feature/auth/services/auth.api.js";
import { setUser, setLoading, setError } from "/src/feature/auth/auth.slice.js";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

const useAuth = () => {
    const dispatch = useDispatch();

    async function handleRegister({ username, email, password }) {
        try {
            dispatch(setLoading(true));

            const user = await register({ username, email, password });

            dispatch(setUser(user));

        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleLogin({ email, password }) {
        try {
            dispatch(setLoading(true));

            const user = await login({ email, password });
            console.log(user)

            dispatch(setUser(user));

        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleGetMe() {
        try {
            dispatch(setLoading(true));

            const user = await getMe();
            
            // console.log(user.user)
            dispatch(setUser(user));
            // const currentUser = useSelector((state) => state.auth.user);
            // console.log("Current user in state:", currentUser);
            

        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleResendVerification() {
        try {
            dispatch(setLoading(true));

            await resendVerification();

        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false));
        }
    }

    return {
        handleRegister,
        handleLogin,
        handleGetMe,
        handleResendVerification
    };
};

export default useAuth;