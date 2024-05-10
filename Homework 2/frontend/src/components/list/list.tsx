import { FC } from "react";
import { ListItem, ListItemType } from "./listItem";
import './list.css'

interface Props {
    children: React.ReactNode
}

export const List: FC<Props> = ({ children }) => {
    if (!Array.isArray(children) || children.length < 2) {
        return <ListItem type="single">{children}</ListItem>
    }


    return <>
        {
            children.map((child, index) => {
                let type: ListItemType = 'first'

                if (index === children.length - 1 && children.length === 2) {
                    type = 'last-only-two'
                } else if (index === children.length - 1) {
                    type = 'last'
                } else if (index > 0) {
                    type = 'middle'
                }

                return <ListItem key={index} type={type}>{child}</ListItem>
            })
        }
    </>
}