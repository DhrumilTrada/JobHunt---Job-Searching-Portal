import useGetAllJobs from "@/hooks/useGetAllJobs"
import CategoryCarousel from "./CategoryCarousel"
import HeroSection from "./HeroSection"
import LatestJobs from "./LatestJobs"
import Footer from "./shared/Footer"
import Navbar from "./shared/Navbar"
import { useEffect } from "react"


function Home() {
  useEffect(() => {
    useGetAllJobs()
  }, [])

  return (
    <>
      <Navbar />
      <HeroSection />
      <CategoryCarousel />
      <LatestJobs />
      <Footer />
    </>
  )
}

export default Home