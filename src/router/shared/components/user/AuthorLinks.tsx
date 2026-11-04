import { MouseEventHandler } from 'react';
import { Link } from 'react-router-dom';

interface AuthorLinksProps {
    authors: string[];
    /** В режиме поиска к ссылке добавляется `?searchId=<id автора>`. */
    searchIds?: number[];
    linkClassName?: string;
    separatorClassName?: string;
    onLinkClick?: MouseEventHandler<HTMLAnchorElement>;
}

/**
 * Авторы через запятую: «a, b, c». Элементы инлайновые, поэтому контейнер
 * с `truncate`/`line-clamp-1` обрезает весь список одной строкой с «…».
 * Раньше каждый автор был блоком: внутри `line-clamp-1` оставался виден
 * только первый, а в шапках страниц имена склеивались без запятых.
 */
export default function AuthorLinks({
    authors,
    searchIds,
    linkClassName,
    separatorClassName,
    onLinkClick
}: AuthorLinksProps) {
    return (
        <>
            {authors.map((author, i) => (
                <span key={`${author}-${i}`}>
                    <Link
                        to={`/user/${encodeURIComponent(author)}${searchIds ? `?searchId=${searchIds[i]}` : ''}`}
                        onClick={onLinkClick}
                        className={linkClassName}
                    >
                        {author}
                    </Link>
                    {i < authors.length - 1 && <span className={separatorClassName}>, </span>}
                </span>
            ))}
        </>
    );
}
