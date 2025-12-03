sequenceDiagram
    participant browser
    participant server
    
    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    server-->>browser: Server response 201, Created
    deactivate server
        
    Note right of browser: Note is sent to the server, but page isn't reloaded. The value is instead appended to the existing notes on the browser using javascript.
