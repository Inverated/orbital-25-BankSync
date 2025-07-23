import ComponentFilterRow from "@/components/settings_components/componentFilterRow"
import { useDatabase } from "@/context/DatabaseContext"
import { useProfile } from "@/context/ProfileContext"
import { useUserId } from "@/context/UserContext"
import { addProfileDetails } from "@/lib/supabaseUpdate"
import { defaultKeywordMap, Profile } from "@/utils/types"
import { CircleCheck, CircleX } from "lucide-react"
import { useEffect, useState } from "react"

export default function CustomFilter() {
    const { keywordMap, refreshProfile, refreshStatus } = useProfile()
    const [categoryArray, setCategoryArray] = useState<[string, string[]][]>([])
    const { transactions } = useDatabase()
    const userId = useUserId()

    const updateContentPosition = (index: number, moveBy: number) => {
        const newPos = index + moveBy
        if (newPos >= categoryArray.length || newPos < 0) {
            return
        }
        const newCatArray = [...categoryArray]
        const temp = newCatArray[index]
        newCatArray[index] = newCatArray[newPos]
        newCatArray[newPos] = temp
        setCategoryArray(newCatArray)
    }

    const updateArrayContent = (index: number, newArray: string[]) => {
        const newCatArray = [...categoryArray]
        newCatArray[index][1] = newArray
        setCategoryArray(newCatArray)
    }

    const resetFilter = async () => {
        const profile: Profile = {
            user_id: userId,
            category_filter: defaultKeywordMap
        }
        await addProfileDetails(userId, profile)
        await refreshProfile()
    }

    const setNewCategoryArray = async () => {
        const profile: Profile = {
            user_id: userId,
            category_filter: Object.fromEntries(categoryArray)
        }
        await addProfileDetails(userId, profile)
        await refreshProfile()
    }

    const initialiseCategoryArray = () => {
        const catArray = [...keywordMap.entries()]
        const uniqueCategory = new Set(transactions.map(each => each.category))
        uniqueCategory.forEach(cat => {
            if (cat == 'Others') return
            if (!keywordMap.has(cat)) {
                catArray.push([cat, []])
            }
        })
        setCategoryArray(catArray)
    }

    useEffect(() => {
        initialiseCategoryArray()
    }, [refreshStatus])

    return (
        <div className="px-7 py-4.5 w-full">
            <div className="text-2xl font-semibold">Custom Filter Condition</div>
            <div className="pt-5">
                <div>
                    The filters are checked in the order listed, from top to bottom. 
                    A filter will only match if the whole word matches -- partical matches will be ignored.
                    <div className="pt-1 text-sm text-gray-400">
                        <p>Example: Matching the word &quot;to&quot;</p>
                        <div className="flex flex-row items-center px-1 p-0.5">
                            <CircleCheck className="w-5 h-5 text-blue-400 mx-1" />From A <span className="text-blue-400 italic mx-1">to</span> B (matches because it contains the whole word &quot;to&quot;)
                        </div> 
                        <div className="flex flex-row items-center px-1">
                            <CircleX className="w-5 h-5 text-red-400 mx-1" />Cus<span className="text-red-400 italic">to</span>m (does not match because &quot;to&quot; is not a whole word by itself)
                        </div> 
                    </div>

                </div>
            </div>
            {categoryArray.map(([category, items], index) =>
                <div key={category} className="flex flex-col my-4 py-1">
                    <ComponentFilterRow
                        category={category}
                        items={items}
                        position={index}
                        updateArrayContent={updateArrayContent}
                        updateContentPosition={updateContentPosition} />
                </div>)
            }
            <div className="flex sm:flex-row not-sm:flex-col not-sm:space-y-2 items-center bottom-0 sticky w-full border-t border-t border-t-2 border-t-gray-300 justify-between px-4 py-2 bg-white z-50">
                <button className="h-fit px-3 py-1.5 rounded-lg hover:cursor-pointer bg-green-500 hover:bg-green-600 active:bg-green-700 active:scale-97 text-white font-semibold tracking-wide transition"
                    onClick={resetFilter}>
                    Reset Filters
                </button>
                <div className="overflow-visible space-x-3 not-sm:flex-col">
                    <button className="h-fit px-3 py-1.5 rounded-lg hover:cursor-pointer bg-green-500 hover:bg-green-600 active:bg-green-700 active:scale-97 text-white font-semibold tracking-wide transition"
                        onClick={initialiseCategoryArray}>
                        Cancel
                    </button>
                    <button className="h-fit px-3 py-1.5 rounded-lg hover:cursor-pointer bg-green-500 hover:bg-green-600 active:bg-green-700 active:scale-97 text-white font-semibold tracking-wide transition"
                        onClick={setNewCategoryArray}>
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    )
}