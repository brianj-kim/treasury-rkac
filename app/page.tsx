import { redirect } from "next/navigation";

const Home = () => {

  return (
    // <section className="py-24">
    //   <div className="container max-w-8xl">
    //     <div>Income Module</div>
    //   </div>
    // </section>
    redirect("/income")
  )
}

export default Home;