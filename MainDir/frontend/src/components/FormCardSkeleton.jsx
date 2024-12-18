import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export function FormCardSkeleton() {
  return (
    <Card className="dark:bg-gray-800">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-2"></div>
      </CardHeader>
      <CardContent>
        <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="h-8 w-1/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-8 w-1/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </CardFooter>
    </Card>
  )
}

