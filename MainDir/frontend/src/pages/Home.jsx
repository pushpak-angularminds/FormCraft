import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormInput, ClipboardList, BarChart } from 'lucide-react'

const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
            <header className="container mx-auto px-4 py-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-blue-600">FormCraft</h1>
                <nav>
                    <Link to='/sign-in' className="text-blue-600 hover:text-blue-800 mr-4">Sign In</Link>
                    <Link to='/sign-up'>
                        <Button variant="outline">Sign Up</Button>
                    </Link>
                </nav>
            </header>

            <main className="container mx-auto px-4 py-12">
                <section className="text-center mb-16">
                    <h2 className="text-5xl font-bold mb-4">Create Dynamic Forms with Ease</h2>
                    <p className="text-xl mb-8">Build, share, and analyze forms in minutes. No coding required.</p>
                    <Link to='/sign-up'>
                        <Button size="lg" className="bg-blue-600 hover:bg-blue-700">Get Started for Free</Button>
                    </Link>
                </section>

                <section className="grid md:grid-cols-3 gap-8 mb-16">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <FormInput className="mr-2 text-blue-600" />
                                Easy Form Creation
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            Intuitive drag-and-drop interface to create forms in minutes.
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <ClipboardList className="mr-2 text-blue-600" />
                                Versatile Question Types
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            Multiple choice, short answer, file upload, and more to suit your needs.
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <BarChart className="mr-2 text-blue-600" />
                                Real-time Analytics
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            Instantly analyze responses with built-in reporting tools.
                        </CardContent>
                    </Card>
                </section>

                <section className="text-center">
                    <h3 className="text-3xl font-bold mb-4">Ready to streamline your data collection?</h3>
                    <Link to='/sign-up'>
                        <Button size="lg" variant="outline" className="mr-4">Create Your First Form</Button>
                    </Link>
                    <Link to='/sign-in'>
                        <Button size="lg">Sign In</Button>
                    </Link>
                </section>
            </main>
        </div>
    )
}

export default Home

