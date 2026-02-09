export type ButtonProps = {} & React.ComponentProps<'button'>;

export function Button({ children, ...props }: ButtonProps) {
    return (
        <button
            {...props}
            className="bg-zinc-800 text-white p-2 rounded cursor-pointer hover:bg-zinc-700"
        >
            {children}
        </button>
    );
}
