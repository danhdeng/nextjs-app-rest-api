import type { NextPage, GetServerSideProps } from 'next';
import useSwr from 'swr';
import { useSWRHandler } from 'swr/dist/use-swr';
import styles from '../styles/Home.module.css';
import fetcher from '../utils/fetcher';

interface User {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
    session: string;
    iat: number;
    exp: number;
}

interface UserPayload {
    _doc: User;
}

const Home: NextPage = ({ fallbackData }) => {
    // const { data, error } = useSwr<UserPayload | null>(
    //     `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/users/me`,
    //     fetcher
    // );
    // if (data) {
    //     console.log('user data: ', data);
    //     return (
    //         <div>
    //             Welcome! {data._doc.firstName} , {data._doc.lastName}
    //         </div>
    //     );
    // }
    if (fallbackData) {
        console.log('user data: ', fallbackData);
        return (
            <div>
                Welcome! {fallbackData._doc.firstName} ,{' '}
                {fallbackData._doc.lastName}
            </div>
        );
    }
    return <div className={styles.container}>Please login</div>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const data = await fetcher(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/users/me`,
        context.req.headers
    );
    return { props: { fallbackData: data } };
};

export default Home;
