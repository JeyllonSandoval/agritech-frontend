import LoginForm from "@/modules/common/components/forms/loginForm";
import RegisterForm from "@/modules/common/components/forms/registerForm";

export default function Signin() {
    return (
        <section className="w-full h-full flex flex-col gap-4 items-center justify-center">
            <RegisterForm />
        </section>
    );
}
