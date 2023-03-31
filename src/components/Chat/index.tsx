//Modules
import gptAvatar from "@/assets/gpt-avatar.svg";
import warning from "@/assets/warning.svg";
import user from "@/assets/user.png";
import { useRef } from "react";
import { useChat } from "@/store/chat";
import { useForm } from "react-hook-form";
import { useAutoAnimate } from "@formkit/auto-animate/react"

//Components
import { Input } from "@/components/Input";
import { FiSend } from "react-icons/fi";
import {
    Avatar,
    IconButton,
    Image,
    Stack,
    Text
} from "@chakra-ui/react";
import ReactMarkdown from 'react-markdown'
import { Instructions } from "../Layout/Instructions";
import Typed from 'react-typed';

export interface ChatProps { };

interface ChatSchema {
    input: string
};

export const Chat = ({ ...props }: ChatProps) => {
    const {
        selectedChat,
        addMessage,
        addChat,
    } = useChat();
    const selectedId = selectedChat?.id

    const hasSelectedChat = selectedChat && selectedChat?.content.length > 0;

    const {
        register,
        setValue,
        handleSubmit
    } = useForm<ChatSchema>();

    const overflowRef = useRef<HTMLDivElement>(null);
    const updateScroll = () => {
        overflowRef.current?.scrollTo(0, overflowRef.current.scrollHeight);
    };

    const [parentRef] = useAutoAnimate();

    const handleAsk = async ({ input: prompt }: ChatSchema) => {
        updateScroll();
        const sendRequest = async (selectedId: string) => {
            setValue("input", "");

            const randomNumber = Math.floor(Math.random() * 999);

            await addMessage(selectedId, {
                id: randomNumber,
                emitter: "user",
                message: prompt
            });

            const countMessages = Math.floor(Math.random() * 32) + 8;

            await addMessage(selectedId, {
                id: randomNumber,
                emitter: "gpt",
                message: [...Array(countMessages)].map(() => "Meow").join(' ')
            });
        };

        if (selectedId) {
            if (prompt) {
                sendRequest(selectedId);
            };
        } else {
            addChat(sendRequest);
        };
    };

    return (
        <Stack
            width="full"
            height="full"
        >
            <Stack
                maxWidth="768px"
                width="full"
                marginX="auto"
                height="85%"
                overflow="auto"
                ref={overflowRef}
            >
                <Stack
                    spacing={2}
                    padding={2}
                    ref={parentRef}
                    height="full"
                >
                    {(hasSelectedChat) ? (
                        selectedChat.content.map(({ id, emitter, message }, key) => {
                            const getAvatar = () => {
                                switch (emitter) {
                                    case "gpt":
                                        return gptAvatar;
                                    case "error":
                                        return warning;
                                    default:
                                        return user;
                                }
                            };

                            const getMessage = () => {
                                if (message.slice(0, 2) == "\n\n") {
                                    return message.slice(2, Infinity);
                                };

                                return message;
                            };

                            return (
                                <Stack
                                    key={key}
                                    direction="row"
                                    padding={4}
                                    rounded={8}
                                    backgroundColor={
                                        (emitter == 'gpt') ? ("blackAlpha.200") : ("transparent")
                                    }
                                    spacing={4}
                                >
                                    <Avatar
                                        name={emitter}
                                        src={getAvatar()}
                                    />
                                    <Text
                                        whiteSpace="pre-wrap"
                                        marginTop=".75em !important"
                                        overflow="hidden"
                                    >
                                        {emitter == 'gpt' ? (
                                            <>
                                                <Image
                                                    src={`https://cataas.com/cat/gif?${id}`}
                                                    width={200}
                                                    height={200}
                                                    rounded={8}
                                                    marginBottom={4}
                                                    loading="lazy"
                                                />
                                                <Typed
                                                    strings={[getMessage()]}
                                                    typeSpeed={20}
                                                    fadeOut
                                                    stopped={false}
                                                />
                                            </>
                                        ) : (
                                            <ReactMarkdown>
                                                {getMessage()}
                                            </ReactMarkdown>
                                        )}
                                    </Text>
                                </Stack>
                            )
                        })
                    ) : (
                        <Instructions
                            onClick={(text) => setValue('input', text)}
                        />
                    )}
                </Stack>
            </Stack>
            <Stack
                height="20%"
                padding={4}
                backgroundColor="blackAlpha.400"
                justifyContent="center"
                alignItems="center"
                overflow="hidden"
            >
                <Stack
                    maxWidth="768px"
                >
                    <Input
                        autoFocus={true}
                        variant="filled"
                        inputRightAddon={(
                            <IconButton
                                aria-label="send_button"
                                icon={(<FiSend />)}
                                backgroundColor="transparent"
                                onClick={handleSubmit(handleAsk)}
                            />
                        )}
                        {...register('input')}
                        onSubmit={console.log}
                        onKeyDown={(e) => {
                            if (e.key == "Enter") {
                                handleAsk({ input: e.currentTarget.value })
                            };
                        }}
                    />
                    <Text
                        textAlign="center"
                        fontSize="sm"
                        opacity={.5}
                    >Free Research Preview. Our goal is to make AI systems more natural and safe to interact with. Your feedback will help us improve.</Text>
                </Stack>
            </Stack>
        </Stack>
    );
};