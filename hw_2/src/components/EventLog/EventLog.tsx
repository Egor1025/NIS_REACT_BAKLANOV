import { useState } from 'react'
import { Drawer, Box, Button, List, ListItem, Divider } from '@mui/material'
import { useEventLog } from '../../hooks/useEventLog.ts'

function EventLog() {
    const { events, clearEvents } = useEventLog()
    const [open, setOpen] = useState(false)

    const toggle = () => setOpen(prev => !prev)

    return (
        <>
            <Button variant="contained" onClick={toggle}>
                Лог событий
            </Button>

            <Drawer anchor="right" open={open} onClose={toggle}>
                <Box width="320px" padding="16px" display="flex" flexDirection="column" height="100%">
                    <Box fontSize="20px" marginBottom="12px" fontWeight={600}>
                        Системные события
                    </Box>

                    <Button variant="outlined" onClick={clearEvents}>
                        Очистить
                    </Button>

                    <Divider sx={{ marginY: '12px' }} />

                    <List sx={{ overflowY: 'auto', flexGrow: 1 }}>
                        {events.map((event, i) => (
                            <ListItem key={i}>{event}</ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
        </>
    )
}

export default EventLog