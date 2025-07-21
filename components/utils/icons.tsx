import { LucideIcon } from "lucide-react";


function AiAdd (props: LucideIcon) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" x="0" y="0" viewBox="0 0 64 64" xmlSpace="preserve" {...props}><g><g ><path fillRule="evenodd" d="M49.95 3.557a2 2 0 0 0-3.9 0l-1.107 4.866a6 6 0 0 1-4.52 4.52l-4.867 1.107a2 2 0 0 0 0 3.9l4.867 1.107a6 6 0 0 1 4.52 4.52l1.107 4.866a2 2 0 0 0 3.9 0l1.107-4.866a6 6 0 0 1 4.52-4.52l4.867-1.107a2 2 0 0 0 0-3.9l-4.867-1.107a6 6 0 0 1-4.52-4.52zM43.638 16A10.007 10.007 0 0 0 48 11.638 10.007 10.007 0 0 0 52.362 16 10.007 10.007 0 0 0 48 20.362 10.007 10.007 0 0 0 43.638 16z" clipRule="evenodd" opacity="1"></path><path d="M27 12C13.193 12 2 23.193 2 37s11.193 25 25 25 25-11.193 25-25a2 2 0 1 0-4 0c0 11.598-9.402 21-21 21S6 48.598 6 37s9.402-21 21-21a2 2 0 1 0 0-4z" opacity="1"></path><path d="M13 37a2 2 0 0 1 2-2h10V25a2 2 0 1 1 4 0v10h10a2 2 0 1 1 0 4H29v10a2 2 0 1 1-4 0V39H15a2 2 0 0 1-2-2z" opacity="1"></path></g></g></svg>
    )
}

function AiMusic (props: LucideIcon) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" x="0" y="0" viewBox="0 0 64 64" xmlSpace="preserve" {...props}><g><g><path fillRule="evenodd" d="M49.95 3.557a2 2 0 0 0-3.9 0l-1.107 4.866a6 6 0 0 1-4.52 4.52l-4.867 1.107a2 2 0 0 0 0 3.9l4.867 1.107a6 6 0 0 1 4.52 4.52l1.107 4.866a2 2 0 0 0 3.9 0l1.107-4.866a6 6 0 0 1 4.52-4.52l4.867-1.107a2 2 0 0 0 0-3.9l-4.867-1.107a6 6 0 0 1-4.52-4.52z" clipRule="evenodd" opacity="1"></path><path d="M22 16a2 2 0 0 1 2 2v42a2 2 0 1 1-4 0V18a2 2 0 0 1 2-2zM6 23a2 2 0 1 0-4 0v32a2 2 0 1 0 4 0zM15 27a2 2 0 1 0-4 0v24a2 2 0 1 0 4 0zM33 24a2 2 0 1 0-4 0v30a2 2 0 1 0 4 0zM40 29a2 2 0 0 1 2 2v16a2 2 0 1 1-4 0V31a2 2 0 0 1 2-2z" opacity="1"></path></g></g></svg>
    );
}


export const AiAddIcon = AiAdd as unknown as LucideIcon;
export const AiMusicIcon = AiMusic as unknown as LucideIcon;