import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { object, string, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useRouter } from 'next/router';

const loginUserSchema = object({
    password: string()
        .nonempty({
            message: 'Password is required',
        })
        .min(6, 'Password is too short - should be min 6 characters'),

    email: string()
        .nonempty({
            message: 'Email is required',
        })
        .email('Not a valid email'),
});

type LoginUserInput = TypeOf<typeof loginUserSchema>;

const ax = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}`,
    withCredentials: true,
});

export default function LoginPage() {
    const router = useRouter();
    const [loginError, setLoginError] = useState('');
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm<LoginUserInput>({
        resolver: zodResolver(loginUserSchema),
    });
    console.log(errors);

    const submitHandler = async (values: LoginUserInput) => {
        try {
            //console.log({ values });
            await ax.post(`/api/sessions`, values, {
                withCredentials: true,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                },
            });
            // router.push('/');
        } catch (error: any) {
            setLoginError(error?.message);
        }
    };
    return (
        <>
            <p>{loginError}</p>
            <form onSubmit={handleSubmit(submitHandler)}>
                <div className="form-element">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="jane.doe@example.com"
                        {...register('email')}
                    />
                    <p>{errors.email?.message}</p>
                </div>
                <div className="form-element">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="password"
                        {...register('password')}
                    />
                    <p>{errors.password?.message}</p>
                </div>
                <button type="submit">Submit</button>
            </form>
        </>
    );
}
