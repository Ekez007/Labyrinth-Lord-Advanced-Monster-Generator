import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Share2, Copy, Check, Clock, Link, Globe } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ShareMonster = ({ monster }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [shareType, setShareType] = useState('link');
  const [expiresIn, setExpiresIn] = useState(7);
  const [shareUrl, setShareUrl] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleShare = async () => {
    if (!monster.id) {
      toast({
        title: "Cannot share",
        description: "Monster must be saved before sharing",
        variant: "destructive"
      });
      return;
    }

    setIsSharing(true);
    try {
      const response = await fetch(`${API}/monsters/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          monsterId: monster.id,
          shareType,
          expiresIn
        })
      });

      if (response.ok) {
        const data = await response.json();
        setShareUrl(data.shareUrl);
        setIsShared(true);
        toast({
          title: "Share link created!",
          description: `Monster can be shared for ${expiresIn} days`,
        });
      } else {
        throw new Error('Failed to create share link');
      }
    } catch (error) {
      toast({
        title: "Share failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSharing(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Share link copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const resetDialog = () => {
    setIsShared(false);
    setShareUrl('');
    setCopied(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetDialog();
    }}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Share2 className="w-4 h-4 mr-1" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-emerald-600" />
            Share {monster.name}
          </DialogTitle>
        </DialogHeader>

        {!isShared ? (
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-lg">
              <h4 className="font-medium text-slate-800 mb-1">{monster.name}</h4>
              <div className="flex gap-2">
                <Badge variant="secondary" className="text-xs">{monster.type}</Badge>
                <Badge variant="outline" className="text-xs">CR {monster.challengeRating}</Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="share-type" className="text-sm font-medium">
                  Share Type
                </Label>
                <Select value={shareType} onValueChange={setShareType}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="link">
                      <div className="flex items-center gap-2">
                        <Link className="w-4 h-4" />
                        Private Link
                      </div>
                    </SelectItem>
                    <SelectItem value="public">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Public Share
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="expires-in" className="text-sm font-medium">
                  Expires In (days)
                </Label>
                <Select value={expiresIn.toString()} onValueChange={(value) => setExpiresIn(parseInt(value))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 day</SelectItem>
                    <SelectItem value="3">3 days</SelectItem>
                    <SelectItem value="7">1 week</SelectItem>
                    <SelectItem value="14">2 weeks</SelectItem>
                    <SelectItem value="30">1 month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleShare}
                disabled={isSharing}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              >
                {isSharing ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 mr-2" />
                    Create Share Link
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-800 mb-2">
                <Check className="w-4 h-4" />
                Share link created successfully!
              </div>
              <p className="text-sm text-green-700">
                This link will expire in {expiresIn} day{expiresIn !== 1 ? 's' : ''}
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium">Share URL</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={shareUrl}
                  readOnly
                  className="text-sm"
                />
                <Button
                  size="sm"
                  onClick={copyToClipboard}
                  variant="outline"
                  disabled={copied}
                >
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-1 text-sm">Share Tips</h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Anyone with this link can view the monster</li>
                <li>• Link will automatically expire after {expiresIn} day{expiresIn !== 1 ? 's' : ''}</li>
                <li>• Viewers cannot edit or save the monster</li>
              </ul>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ShareMonster;