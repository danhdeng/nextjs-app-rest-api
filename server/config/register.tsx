import React from 'react';
import { useForm } from 'react-hook-form';
import { object, string, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const createUserSchema = object({
    firstName: string().nonempty({
        message: 'First Name is required.',
    }),
    lastName: string().nonempty({
        message: 'Last name is required',
    }),
    password: string()
        .nonempty({
            message: 'Password is required',
        })
        .min(6, 'Password is too short - should be min 6 characters'),
    confirmedPassword: string().nonempty({
        message: 'Confirmed Password is required',
    }),
    email: string()
        .nonempty({
            message: 'Email is required',
        })
        .email('Not a valid email'),
}).refine((data) => data.password === data.confirmedPassword, {
    message: 'Passwords do not match',
    path: ['confirmedPassword'],
});

type CreateUserInput = TypeOf<typeof createUserSchema>;

export default function RegisterPage() {
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm<CreateUserInput>({
        resolver: zodResolver(createUserSchema),
    });
    console.log(errors);

    const submitHandler = (values: CreateUserInput) => {
        console.log({ values });
    };
    return (
        <>
            <form onSubmit={handleSubmit(submitHandler)}>
                <div className="form-element">
                    <label htmlFor="firstName">First Name</label>
                    <input
                        id="firstName"
                        type="text"
                        placeholder="jane"
                        {...register('firstName')}
                    />
                    <p>{errors.firstName?.message}</p>
                </div>
                <div className="form-element">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                        id="lastName"
                        type="text"
                        placeholder="doe"
                        {...register('lastName')}
                    />
                    <p>{errors.lastName?.message}</p>
                </div>
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
                <div className="form-element">
                    <label htmlFor="confirmedPassword">Confirmed Pssword</label>
                    <input
                        id="confirmedPassword"
                        type="password"
                        placeholder="Confirmed Pssword"
                        {...register('confirmedPassword')}
                    />
                    <p>{errors.confirmedPassword?.message}</p>
                </div>
                <button type="submit">Submit</button>
            </form>
        </>
    );
}
