import Signin from "@/modules/signin/page";
import RegisterForm from "@/modules/common/components/forms/registerForm";

export default function SigninPage() {
    return (
        <div className="flex flex-col gap-56">
            <Signin />
            <RegisterForm />
        </div>
    );
}
