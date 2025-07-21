self.onmessage = async(event)=>{

    const { currentId, visited } = event.data;
    if (!currentId) return;

    try {

        const response = await fetch('/api/v1/song/ai-shuffle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                not: visited,
                limit: 10,
                recommendationId: currentId,
            }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        self.postMessage({ success: true, data: data });
        
    } catch (error) {
        self.postMessage({ success: false, error: error.message });
    }
}