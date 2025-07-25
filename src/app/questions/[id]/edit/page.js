"use client";
import QuestionForm from "@/components/QuestionsForm";
import axios from "axios";
import React, { useEffect ,useState} from "react";
import { LoaderOne } from "@/components/ui/loader";
import { useParams } from "next/navigation";
import { storage } from "@/models/client/config";
import { questionAttachmentBucket } from "@/models/name";

function EditPage() {
  const [isloading, setLoading] = useState(false);
  const [initialData, setData] = useState({
    title: "",
    content: "",
    attachments: [],
    questionId: "",
    tags: [],
  });
  const params=useParams();
  const fetchData = async () => {
    setLoading(() => true);
    const response = await axios.post("/api/questionEdit", { questionId:params.id });
    if (response.data?.success) {
      const data= response.data?.data;
      const attachemntData = await Promise.all(
        data.attachments.map(async (fileId) => {
          const fileMeta = await storage.getFile(
            questionAttachmentBucket,
            fileId
          );
          const preview = storage.getFileView(questionAttachmentBucket, fileId);
          return {
            $id: fileMeta.$id,
            name: fileMeta.name,
            mimeType: fileMeta.mimeType,
            sizeOriginal: fileMeta.sizeOriginal,
            bucketId: fileMeta.bucketId,
            preview,
          };
        })
      );
      data.attachments=attachemntData;
      setData(data);
    }
    setLoading(() => false);
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      {isloading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <LoaderOne />
        </div>
      )}
      <QuestionForm mode="edit" initialData={initialData} />
    </>
  );
}

export default EditPage;
