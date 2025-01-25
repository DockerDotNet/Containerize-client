import { Tag } from "antd"

interface DefaultTagsProps {
    tags: string[];
  }

export const DefaultTags: React.FC<DefaultTagsProps> = ({tags}) => tags.map((tag) => {
    return (
        <Tag key={tag}>{tag}</Tag>
    )
})