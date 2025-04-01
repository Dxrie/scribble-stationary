"use client";

import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

type FormValues = {
    proofOfPayment?: File;
};

const UploadForm = ({setProofOfPayment}: {setProofOfPayment: (file: File | null) => void}) => {
    const form = useForm<FormValues>({
        defaultValues: {
            proofOfPayment: undefined,
        },
    });

    return (
        <Form {...form}>
            <form className="space-y-8">
                <FormField
                    control={form.control}
                    name="proofOfPayment"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Dropzone
                                    onDrop={(acceptedFiles: File[]) => {
                                        field.onChange(acceptedFiles[0]);
                                        setProofOfPayment(acceptedFiles[0]);
                                    }}
                                    file={field.value}
                                    onRemove={() => {
                                        field.onChange(undefined);
                                        setProofOfPayment(null);
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
};

const Dropzone = ({ onDrop, file, onRemove }: { onDrop: (files: File[]) => void; file?: File; onRemove: () => void }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".jpeg", ".png", ".jpg"],
        },
        maxFiles: 1,
    });

    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);

            return () => URL.revokeObjectURL(objectUrl);
        } else {
            setPreview(null);
        }
    }, [file]);

    return (
        <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center ${
                isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-background"
            }`}
        >
            <input {...getInputProps()} />
            {file && preview ? (
                <div className="flex flex-col items-center justify-center">
                    <img src={preview} alt="Proof of Payment" className="max-w-full h-32 object-cover rounded-lg mb-2" />
                    <Button variant="destructive" onClick={(e) => { e.stopPropagation(); onRemove(); }}>
                        Remove
                    </Button>
                </div>
            ) : (
                <p className="text-gray-500">
                    {isDragActive
                        ? "Drop the proof of payment here..."
                        : "Drag and drop the proof of payment here, or click to select the file"}
                </p>
            )}
        </div>
    );
};

export default UploadForm;
