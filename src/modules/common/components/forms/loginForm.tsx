export default function LoginForm() {
    return (
        <section className="w-full h-full flex justify-center items-center">
            <form className="w-1/2 h-full flex flex-col justify-center items-center">
                <div className="w-full h-full flex flex-col justify-center items-center">
                    <h1 className="text-4xl m-0 p-0">Login</h1>
                    <p className="text-lg m-0 p-0">Welcome back to AgriTech</p>
                    <div className="w-full h-full flex flex-col justify-center items-center">
                        <input className="w-full h-full bg-transparent border-b-2" type="text" placeholder="Email" />
                        <input className="w-full h-full bg-transparent border-b-2" type="password" placeholder="Password" />
                        <button className="w-full h-full" type="submit">Login</button>
                    </div>
                </div>
            </form>
        </section>
    );
}
