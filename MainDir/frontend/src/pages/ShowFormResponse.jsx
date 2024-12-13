import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export default function ShowFormResponses() {
    const { formId } = useParams();

    const [data, setData] = useState([]);
    
    useEffect(() => {
        async function getUserForms() {
            try {
                const response = await axios.get(`http://localhost:3000/show-responses/${formId}`);
                setData(response?.data);
                console.log('response', response);
            } catch (error) {
                console.log(error);
                toast({
                    title: "Error",
                    description: error?.response?.data?.error || "Failed to fetch data",
                    variant: "destructive",
                });
            }
        }
        getUserForms();
    }, [formId]);

    console.log(data);

    // Group responses by version
    const groupedByVersion = data.reduce((acc, item) => {
        if (!acc[item.version]) { // 
            acc[item.version] = [];
        }
        console.log('acc-->', acc)
        acc[item.version].push(item); // simple it check the index or in or case version of array and pushes it to that field 
        return acc;
    }, {});

    console.log('groupedByVersion', groupedByVersion)
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6">Form Responses</h1>

            {Object.keys(groupedByVersion).map((version) => {
                const versionData = groupedByVersion[version];
                return (
                    <Card key={version} className="w-full max-w-6xl mx-auto mb-6">
                        <CardHeader>
                            <CardTitle>Edit- Version {version}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {versionData?.length === 0 ? <h2>No responses for this version</h2> :
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Submitted At</TableHead>
                                            {versionData[0]?.answers.map((item, index) => (
                                                <TableHead key={index}>
                                                    {item.required ? item.question + '(optional)' : item.question}
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {versionData?.map((item, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell>{new Date(item?.submittedAt)?.toLocaleString()}</TableCell>
                                                {item?.answers?.map((ans, index) => (
                                                    <TableCell key={index}>
                                                        {ans.answer ? (
                                                            Array.isArray(ans.answer)
                                                                ? ans?.answer.join(', ')
                                                                : ans?.answer?.toString()
                                                        ) : '-'}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            }
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
