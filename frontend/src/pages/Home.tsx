import Button from "../components/Button"
import { Slidebar } from "../components/Slidebar"
import { PlusIcon } from "../icons/PlusIcon"
import { ShareIcon } from "../icons/ShareIcon"
import { Card } from "../components/Card"
import { DeleteIcon } from "../icons/DeletIcon"
import { DescriptionIcon } from "../icons/DescriptionIcon"
import { CreateModal } from "../components/CreateModal"
import { useState } from "react"
import useContents from "../hooks/useContents"

export default function Home() {
  const [openModel, setOpenModel] = useState(false);
  const contents = useContents();
  return ( 
    <div className="flex min-h-screen overflow-auto bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Sidebar */}
      <div className="w-64">
        <Slidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 pl-4 flex flex-col min-h-screen">
        {/* topbar */}
        <div className="flex justify-between py-4 pr-4">
          <div className="flex items-center text-xl pl-3 font-bold underline text-white">All Notes</div>
          <div className="flex items-center space-x-4 pr-2">
            <Button varient="primary" size="lg" text="Content" startIcon={<PlusIcon size="md" />} onClick={() => {
              setOpenModel(true)
            }} />
            <Button varient="secondary" size="md" text="Share" startIcon={<ShareIcon size="md" />} onClick={() => {}} />
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-4 gap-4 pr-4 pb-4">
          {(contents || []).map(({_id, type, link, title, tags, userId}, idx) => 
            <Card
              key={_id || idx}
              startIcon={<DescriptionIcon />}
              heading={title}
              endIcon1={<ShareIcon size="md" />}
              endIcon2={<DeleteIcon />}
              title="Future Projects"
              links={link}
              type={type === "video" ? "youtube" : type === "article" ? "twitter" : type}
              tags={tags}
              date="Added on 10/03/2025"
              //@ts-ignore
              user={userId?.username}
            />
          )}
        </div>

          {/* Create Content Modal */}
        <CreateModal open={openModel} onClose={() => {
          setOpenModel(false);
        }} />
      </div>
    </div>
  )
}
