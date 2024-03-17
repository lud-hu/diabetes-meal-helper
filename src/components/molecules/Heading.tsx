interface HeadingProps {
    title: string;
    subtitle?: string;
}

function Heading({ title, subtitle }: HeadingProps) {
    return (
        <div className="mb-6">
            <h2 className="text-xl font-bold">{title}</h2>
            {subtitle && <small>{subtitle}</small>}
        </div>
    );
}

export default Heading;
