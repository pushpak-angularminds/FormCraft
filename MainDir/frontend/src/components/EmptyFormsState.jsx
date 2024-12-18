import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

export function EmptyFormsState() {
  return (
    <Card className="w-full max-w-md mx-auto text-center">
      <CardHeader>
        <CardTitle className="text-2xl">Welcome to Form Creator!</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          You haven't created any forms yet. Start by creating your first form and begin collecting responses!
        </p>
        <div className="flex justify-center">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKMTHEOkAGhu306cFaWAo8-v4y_ElhRjkS6g&s"
            alt="No forms illustration"
            className="w-48 h-48"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link to="/create-form">
          <Button className="bg-blue-700 dark:bg-blue-600">
            <PlusCircle className="mr-2 h-4 w-4" /> Create Your First Form
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

