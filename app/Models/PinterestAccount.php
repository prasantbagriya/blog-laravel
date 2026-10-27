<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PinterestAccount extends Model
{
    use HasFactory;

    protected $table = 'pinterest_accounts';

    protected $fillable = [
        'user_id',
        'pinterest_user_id',
        'username',
        'name',
        'profile_image',
        'bio',
        'follower_count',
        'pin_count',
        'board_count',
        'access_token',
        'refresh_token',
        'token_expires_at',
        'is_active',
    ];

    protected $casts = [
        'token_expires_at' => 'datetime',
        'is_active' => 'boolean',
        'follower_count' => 'integer',
        'pin_count' => 'integer',
        'board_count' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function boards(): HasMany
    {
        return $this->hasMany(PinterestBoard::class, 'pinterest_account_id');
    }

    public function shares(): HasMany
    {
        return $this->hasMany(PinterestPinShare::class, 'pinterest_account_id');
    }

    public function defaultBoard(): ?PinterestBoard
    {
        return $this->boards()->where('is_default', true)->first() ?: $this->boards()->first();
    }

    public static function active(): ?self
    {
        $account = self::with('boards')->where('is_active', true)->latest()->first();
        if (!$account && !app()->environment('testing')) {
            $configuredToken = config('services.pinterest.access_token') ?: env('PINTEREST_ACCESS_TOKEN');
            if (!empty($configuredToken)) {
                try {
                    $authService = app(\App\Services\Pinterest\PinterestAuthService::class);
                    $account = $authService->syncUserFromToken($configuredToken);
                    app(\App\Services\Pinterest\PinterestService::class)->syncBoards($account);
                    $account->load('boards');
                } catch (\Throwable $e) {
                    \Illuminate\Support\Facades\Log::warning('Auto-sync PinterestAccount::active failed: ' . $e->getMessage());
                }
            }
        }
        return $account;
    }
}
