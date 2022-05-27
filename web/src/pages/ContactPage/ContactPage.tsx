import {
    FieldError,
    Form,
    FormError,
    Label,
    Submit,
    SubmitHandler,
    TextAreaField,
    TextField,
    useForm,
} from '@redwoodjs/forms';
import { MetaTags, useMutation } from '@redwoodjs/web';
import { Toaster, toast } from '@redwoodjs/web/toast';

import {
    CreateContactMutation,
    CreateContactMutationVariables,
} from 'types/graphql';

const CREATE_CONTACT = gql`
    mutation CreateContactMutation($input: CreateContactInput!) {
        createContact(input: $input) {
            id
        }
    }
`;

interface FormValues {
    email: string;
    message: string;
    name: string;
}

const ContactPage = () => {
    const formMethods = useForm({ mode: 'onBlur' });

    const [create, { error, loading }] = useMutation<
        CreateContactMutation,
        CreateContactMutationVariables
    >(CREATE_CONTACT, {
        onCompleted: () => {
            toast.success('Thank you for your submission!');
            formMethods.reset();
        },
    });

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        create({ variables: { input: data } });
    };

    return (
        <>
            <MetaTags title="Contact" description="Contact page" />

            <Toaster />
            <Form
                config={{ mode: 'onBlur' }}
                error={error}
                formMethods={formMethods}
                onSubmit={onSubmit}
            >
                <FormError error={error} wrapperClassName="form-error" />

                <Label errorClassName="error" name="name">
                    Name
                </Label>
                <TextField
                    errorClassName="error"
                    name="name"
                    validation={{ required: true }}
                />
                <FieldError className="error" name="name" />

                <Label errorClassName="error" name="email">
                    Email
                </Label>
                <TextField
                    errorClassName="error"
                    name="email"
                    validation={{
                        pattern: {
                            value: /^[^@]+@[^.]+\..+$/,
                            message: 'Please enter a valid email address',
                        },
                        required: true,
                    }}
                />
                <FieldError className="error" name="email" />

                <Label errorClassName="error" name="message">
                    Message
                </Label>
                <TextAreaField
                    errorClassName="error"
                    name="message"
                    validation={{ required: true }}
                />
                <FieldError className="error" name="message" />

                <Submit disabled={loading}>Save</Submit>
            </Form>
        </>
    );
};

export default ContactPage;
