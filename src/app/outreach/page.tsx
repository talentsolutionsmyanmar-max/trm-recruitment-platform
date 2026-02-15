'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockClients, mockEmailTemplates } from '@/lib/data';
import { EmailTemplate } from '@/lib/types';
import { getInitials } from '@/lib/utils';
import { Mail, Send, FileText, Users, MessageSquare, Phone, History, Plus } from 'lucide-react';

export default function OutreachPage() {
  const [activeTab, setActiveTab] = useState('email');
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [emailData, setEmailData] = useState({
    to: '',
    subject: '',
    body: '',
  });
  const [smsData, setSmsData] = useState({
    to: '',
    message: '',
  });

  const handleSendEmail = () => {
    alert('Email sent! (Demo)');
    setEmailData({ to: '', subject: '', body: '' });
  };

  const handleSendSms = () => {
    alert('SMS sent! (Demo)');
    setSmsData({ to: '', message: '' });
  };

  const applyTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setEmailData({
      ...emailData,
      subject: template.subject,
      body: template.body,
    });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Outreach" subtitle="Email and SMS communications" />
        
        <main className="flex-1 overflow-auto p-6 bg-slate-50">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </TabsTrigger>
              <TabsTrigger value="sms" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                SMS
              </TabsTrigger>
              <TabsTrigger value="templates" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                History
              </TabsTrigger>
            </TabsList>

            {/* Email Tab */}
            <TabsContent value="email">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Compose Email
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Recipient</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="email@example.com"
                          value={emailData.to}
                          onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
                        />
                        <Select onValueChange={(value) => setEmailData({ ...emailData, to: value })}>
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Select Client" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockClients.map((client) => (
                              <SelectItem key={client.id} value={client.email}>
                                {client.contactPerson}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Subject</Label>
                      <Input
                        value={emailData.subject}
                        onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                        placeholder="Email subject..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Message</Label>
                      <Textarea
                        value={emailData.body}
                        onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
                        placeholder="Write your message..."
                        rows={12}
                      />
                    </div>

                    <div className="flex justify-end gap-3">
                      <Button variant="outline">Save Draft</Button>
                      <Button onClick={handleSendEmail}>
                        <Send className="h-4 w-4 mr-2" />
                        Send Email
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Quick Templates</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {mockEmailTemplates.map((template) => (
                      <Button
                        key={template.id}
                        variant="outline"
                        className="w-full justify-start text-left h-auto py-3"
                        onClick={() => applyTemplate(template)}
                      >
                        <div>
                          <p className="font-medium">{template.name}</p>
                          <p className="text-xs text-slate-500 capitalize">{template.category}</p>
                        </div>
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* SMS Tab */}
            <TabsContent value="sms">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Send SMS
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="+95 9 XXX XXX XXX"
                          value={smsData.to}
                          onChange={(e) => setSmsData({ ...smsData, to: e.target.value })}
                        />
                        <Select onValueChange={(value) => setSmsData({ ...smsData, to: value })}>
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Select Client" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockClients.map((client) => (
                              <SelectItem key={client.id} value={client.phone}>
                                {client.contactPerson}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Message</Label>
                      <Textarea
                        value={smsData.message}
                        onChange={(e) => setSmsData({ ...smsData, message: e.target.value })}
                        placeholder="Your SMS message (max 160 characters)..."
                        rows={4}
                        maxLength={160}
                      />
                      <p className="text-xs text-slate-500 text-right">
                        {smsData.message.length}/160 characters
                      </p>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-800 mb-2">Supported Carriers</p>
                      <div className="flex gap-2">
                        <Badge variant="secondary">MPT</Badge>
                        <Badge variant="secondary">Telenor</Badge>
                        <Badge variant="secondary">Ooredoo</Badge>
                        <Badge variant="secondary">MyTel</Badge>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3">
                      <Button variant="outline">Preview</Button>
                      <Button onClick={handleSendSms}>
                        <Send className="h-4 w-4 mr-2" />
                        Send SMS
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">SMS Templates</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left h-auto py-3"
                      onClick={() => setSmsData({ 
                        ...smsData, 
                        message: 'Interview confirmed for {{date}} at {{time}}. Location: {{location}}. Please bring your ID.' 
                      })}
                    >
                      Interview Confirmation
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left h-auto py-3"
                      onClick={() => setSmsData({ 
                        ...smsData, 
                        message: 'Your application has been received. We will contact you within 3-5 business days.' 
                      })}
                    >
                      Application Received
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left h-auto py-3"
                      onClick={() => setSmsData({ 
                        ...smsData, 
                        message: 'Congratulations! You have been selected for {{position}}. Please contact us for next steps.' 
                      })}
                    >
                      Placement Notification
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left h-auto py-3"
                      onClick={() => setSmsData({ 
                        ...smsData, 
                        message: 'Reminder: Your interview is tomorrow at {{time}}. Location: {{location}}' 
                      })}
                    >
                      Interview Reminder
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Templates Tab */}
            <TabsContent value="templates">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Email Templates</CardTitle>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New Template
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockEmailTemplates.map((template) => (
                      <Card key={template.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium">{template.name}</h4>
                              <p className="text-sm text-slate-500 mt-1">Subject: {template.subject}</p>
                              <p className="text-xs text-slate-400 mt-2 capitalize">
                                Category: {template.category}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">Edit</Button>
                              <Button variant="ghost" size="sm">Use</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Communication History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { type: 'email', to: 'U Thant Zin', subject: 'Staffing Proposal', time: '2 hours ago', status: 'delivered' },
                      { type: 'sms', to: 'Mg Aung', message: 'Interview confirmed for...', time: '5 hours ago', status: 'sent' },
                      { type: 'email', to: 'Daw Mya Mya', subject: 'Follow-up Meeting', time: '1 day ago', status: 'opened' },
                      { type: 'sms', to: 'Ma Hla Hla', message: 'Your application has been...', time: '2 days ago', status: 'delivered' },
                      { type: 'email', to: 'U Kyaw Soe', subject: 'Candidate Profile', time: '3 days ago', status: 'delivered' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                        <div className={`p-2 rounded-lg ${item.type === 'email' ? 'bg-blue-100' : 'bg-green-100'}`}>
                          {item.type === 'email' ? (
                            <Mail className="h-4 w-4 text-blue-600" />
                          ) : (
                            <MessageSquare className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">{item.to}</p>
                          <p className="text-sm text-slate-500">
                            {item.subject || item.message}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant={item.status === 'opened' ? 'default' : 'secondary'}>
                            {item.status}
                          </Badge>
                          <p className="text-xs text-slate-400 mt-1">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
