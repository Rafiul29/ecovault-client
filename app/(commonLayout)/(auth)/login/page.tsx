// import LoginForm from "@/components/modules/Auth/LoginForm"
interface LoginParams {
  searchParams: Promise<{ redirect?: string }>
}

const LoginPage = async ({ searchParams }: LoginParams) => {
  const { redirect } = await searchParams || {};
  return (
    <div className="flex items-center justify-center h-screen">
      {/* <LoginForm redirectPath={redirect} /> */}dcvbgg
    </div>
  )
}

export default LoginPage