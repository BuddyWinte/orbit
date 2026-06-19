import workspace from "@/layouts/workspace";
import { pageWithLayout } from "@/layoutTypes";
import { useRouter } from "next/router";

const Forms: pageWithLayout =() => {
  return (
    <div className="pagePadding">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-white leading-tight truncate">
              Forms
            </h1>
          </div>
        </div>
      </div>
    </div>
  )
}

Forms.layout = workspace;
export default Forms;