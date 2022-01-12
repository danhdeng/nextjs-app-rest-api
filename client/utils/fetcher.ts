// import axios from 'axios';

// const fetcher = <T>(url: string): Promise<T | void> =>
//     axios
//         .get<T>(url, { withCredentials: true })
//         .then((res) => res.data)
//         .catch((error) => {
//             console.error(error);
//         });
// export default fetcher;

import axios from 'axios';

const fetcher = async <T>(url: string, headers = {}): Promise<T | null> => {
    try {
        const { data } = await axios.get<T>(url, {
            headers,
            withCredentials: true,
        });
        return data;
    } catch (e) {
        console.error(e);
        return null;
    }
};

export default fetcher;
