import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import Icon from "@/components/ui/icon";

interface Message {
  id: number;
  text: string;
  sender: "employee" | "client";
  time: string;
  isEncrypted: boolean;
  file?: {
    name: string;
    size: string;
    type: string;
  };
}

interface Transaction {
  id: number;
  date: string;
  type: string;
  amount: string;
  status: "completed" | "pending" | "failed";
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Добрый день! Помогите, пожалуйста, с вопросом по кредиту.", sender: "client", time: "14:23", isEncrypted: true },
    { id: 2, text: "Здравствуйте! Конечно, помогу. Что именно вас интересует?", sender: "employee", time: "14:24", isEncrypted: true },
    { id: 3, text: "Хочу узнать про досрочное погашение кредита.", sender: "client", time: "14:25", isEncrypted: true },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [notes, setNotes] = useState("Клиент интересовался досрочным погашением кредита 15.01.2026");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const client = {
    name: "Иванов Иван Петрович",
    accountNumber: "40817810123456789012",
    phone: "+7 (999) 123-45-67",
    email: "ivanov@example.com",
    status: "Verified",
    balance: "450 000 ₽",
  };

  const transactions: Transaction[] = [
    { id: 1, date: "01.02.2026", type: "Платёж по кредиту", amount: "-15 000 ₽", status: "completed" },
    { id: 2, date: "28.01.2026", type: "Пополнение счёта", amount: "+50 000 ₽", status: "completed" },
    { id: 3, date: "15.01.2026", type: "Перевод на карту", amount: "-8 500 ₽", status: "completed" },
  ];

  const templates = [
    "Спасибо за обращение! Я уточню информацию и свяжусь с вами.",
    "Для решения вашего вопроса потребуется 2-3 рабочих дня.",
    "Пожалуйста, предоставьте копию документа для дальнейшей обработки.",
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          text: newMessage,
          sender: "employee",
          time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
          isEncrypted: true,
        },
      ]);
      setNewMessage("");
    }
  };

  const handleTemplateClick = (template: string) => {
    setNewMessage(template);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileAttach = () => {
    fileInputRef.current?.click();
  };

  const handleSendWithFile = () => {
    if (selectedFile) {
      const fileSize = (selectedFile.size / 1024).toFixed(1) + ' KB';
      const fileType = selectedFile.type.split('/')[1]?.toUpperCase() || 'FILE';
      
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          text: newMessage || "Документ отправлен",
          sender: "employee",
          time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
          isEncrypted: true,
          file: {
            name: selectedFile.name,
            size: fileSize,
            type: fileType,
          },
        },
      ]);
      setNewMessage("");
      setSelectedFile(null);
    } else {
      handleSendMessage();
    }
  };

  return (
    <div className="h-screen flex bg-gray-50">
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary text-white">ИИ</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-lg">{client.name}</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon name="Shield" size={14} className="text-green-600" />
                <span>Защищённый чат</span>
              </div>
            </div>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {client.status}
          </Badge>
        </div>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === "employee" ? "flex-row-reverse" : ""}`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className={message.sender === "employee" ? "bg-primary text-white" : "bg-gray-200"}>
                    {message.sender === "employee" ? "С" : "К"}
                  </AvatarFallback>
                </Avatar>
                <div className={`flex flex-col gap-1 max-w-md ${message.sender === "employee" ? "items-end" : ""}`}>
                  <div
                    className={`px-4 py-3 rounded-2xl ${
                      message.sender === "employee"
                        ? "bg-primary text-white"
                        : "bg-white border shadow-sm"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    {message.file && (
                      <div className={`mt-3 p-3 rounded-lg flex items-center gap-3 ${
                        message.sender === "employee" 
                          ? "bg-white/20" 
                          : "bg-gray-50"
                      }`}>
                        <div className={`p-2 rounded ${
                          message.sender === "employee"
                            ? "bg-white/30"
                            : "bg-primary/10"
                        }`}>
                          <Icon name="FileText" size={20} className={message.sender === "employee" ? "text-white" : "text-primary"} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${
                            message.sender === "employee" ? "text-white" : "text-gray-900"
                          }`}>
                            {message.file.name}
                          </p>
                          <p className={`text-xs ${
                            message.sender === "employee" ? "text-white/70" : "text-gray-500"
                          }`}>
                            {message.file.type} · {message.file.size}
                          </p>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className={`h-8 w-8 ${
                            message.sender === "employee"
                              ? "text-white hover:bg-white/20"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          <Icon name="Download" size={16} />
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 px-2">
                    {message.isEncrypted && (
                      <Icon name="Lock" size={12} className="text-gray-400" />
                    )}
                    <span className="text-xs text-muted-foreground">{message.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="bg-white border-t p-4">
          <div className="max-w-4xl mx-auto space-y-3">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {templates.map((template, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="whitespace-nowrap text-xs"
                  onClick={() => handleTemplateClick(template)}
                >
                  <Icon name="MessageSquare" size={14} className="mr-1" />
                  {template.substring(0, 30)}...
                </Button>
              ))}
            </div>

            {selectedFile && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <Icon name="FileText" size={20} className="text-green-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-green-900 truncate">{selectedFile.name}</p>
                  <p className="text-xs text-green-600">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-green-600 hover:text-green-700"
                  onClick={() => setSelectedFile(null)}
                >
                  <Icon name="X" size={16} />
                </Button>
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <Button variant="outline" size="icon" onClick={handleFileAttach}>
                <Icon name="Paperclip" size={20} />
              </Button>
              <Input
                placeholder="Введите сообщение..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendWithFile()}
                className="flex-1"
              />
              <Button onClick={handleSendWithFile}>
                <Icon name="Send" size={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-96 bg-white border-l overflow-y-auto">
        <div className="p-6 border-b">
          <h3 className="font-semibold text-lg mb-4">Профиль клиента</h3>
          <div className="flex flex-col items-center gap-3 mb-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary text-white text-2xl">ИИ</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h4 className="font-semibold">{client.name}</h4>
              <p className="text-sm text-muted-foreground">{client.accountNumber}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Icon name="Phone" size={16} className="text-muted-foreground" />
              <span>{client.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Icon name="Mail" size={16} className="text-muted-foreground" />
              <span>{client.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Icon name="Wallet" size={16} className="text-muted-foreground" />
              <span className="font-semibold text-primary">{client.balance}</span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="transactions" className="p-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="transactions">Операции</TabsTrigger>
            <TabsTrigger value="notes">Заметки</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-4 mt-4">
            {transactions.map((transaction) => (
              <Card key={transaction.id} className="shadow-sm">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-medium">{transaction.type}</p>
                    <Badge
                      variant={transaction.status === "completed" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {transaction.status === "completed" ? "Завершено" : "В обработке"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">{transaction.date}</span>
                    <span className={`font-semibold ${transaction.amount.startsWith("-") ? "text-red-600" : "text-green-600"}`}>
                      {transaction.amount}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="notes" className="mt-4">
            <Textarea
              placeholder="Добавьте заметки о клиенте..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[200px] resize-none"
            />
            <Button className="w-full mt-3" variant="outline">
              <Icon name="Save" size={16} className="mr-2" />
              Сохранить заметки
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;