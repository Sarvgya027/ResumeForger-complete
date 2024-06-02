import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { getUserDetail } from "../api";


const UseUser = () => {
    const { data, isLoading, isError, refetch } = useQuery(
        "user",
        async () => {
            try {
                const userDetail = await getUserDetail();
                return userDetail;
            } catch (err) {
                if (!err.message.includes("not authenticated")) {
                    toast.error("Something went wrong, please try again later");
                }
            }
        },
        {
            refetchOnWindowFocus: false,
        }
    );

    return { data, isLoading, isError, refetch };
};

export default UseUser;